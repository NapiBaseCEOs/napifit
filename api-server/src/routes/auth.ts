import { Router } from "express";
import { z } from "zod";
import { supabase, supabaseAdmin, hasSupabaseServiceRole } from "../config/supabase";
import { authenticateRequest, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// Validation schemas
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(6),
});

// In-memory code storage (production'da Redis veya database kullanılmalı)
const resetCodes = new Map<string, { code: string; expiresAt: number }>();

// Helper function to generate 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to send email (placeholder - production'da email service kullanılmalı)
async function sendResetCodeEmail(email: string, code: string): Promise<void> {
  // TODO: Implement email sending (Supabase Auth email veya email service)
  console.log(`Reset code for ${email}: ${code}`);
  // For now, we'll use Supabase Auth's password reset
}

// POST /api/auth/signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = signInSchema.parse(req.body);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        message: "Giriş başarısız",
        error: error.message,
      });
    }

    if (!data.session || !data.user) {
      return res.status(401).json({
        message: "Giriş başarısız",
        error: "Session oluşturulamadı",
      });
    }

    res.json({
      message: "Giriş başarılı",
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Geçersiz istek",
        errors: error.errors,
      });
    }
    console.error("Sign in error:", error);
    res.status(500).json({
      message: "Giriş sırasında hata oluştu",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = signUpSchema.parse(req.body);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || email.split("@")[0],
        },
      },
    });

    if (error) {
      return res.status(400).json({
        message: "Kayıt başarısız",
        error: error.message,
      });
    }

    if (!data.user) {
      return res.status(400).json({
        message: "Kayıt başarısız",
        error: "Kullanıcı oluşturulamadı",
      });
    }

    res.json({
      message: "Kayıt başarılı",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      requiresEmailVerification: !data.session, // Email doğrulama gerekiyorsa session olmaz
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Geçersiz istek",
        errors: error.errors,
      });
    }
    console.error("Sign up error:", error);
    res.status(500).json({
      message: "Kayıt sırasında hata oluştu",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/auth/signout
router.post("/signout", authenticateRequest, async (req: AuthenticatedRequest, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.substring(7);

    if (token) {
      await supabase.auth.signOut();
    }

    res.json({
      message: "Çıkış başarılı",
    });
  } catch (error) {
    console.error("Sign out error:", error);
    res.status(500).json({
      message: "Çıkış sırasında hata oluştu",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/auth/forgot-password (Web için email link, Android için code)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const platform = req.headers["x-platform"] as string | undefined;

    // Android için in-app code gönder
    if (platform === "android") {
      const code = generateCode();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 dakika

      resetCodes.set(email, { code, expiresAt });

      // Email gönder (placeholder)
      await sendResetCodeEmail(email, code);

      res.json({
        message: "Şifre sıfırlama kodu email adresinize gönderildi",
        code: code, // Development için - production'da kaldırılmalı
      });
    } else {
      // Web için Supabase Auth password reset (email link)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
      });

      if (error) {
        return res.status(400).json({
          message: "Şifre sıfırlama isteği gönderilemedi",
          error: error.message,
        });
      }

      res.json({
        message: "Şifre sıfırlama linki email adresinize gönderildi",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Geçersiz istek",
        errors: error.errors,
      });
    }
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "Şifre sıfırlama isteği sırasında hata oluştu",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/auth/verify-code (Android için)
router.post("/verify-code", async (req, res) => {
  try {
    const { email, code } = verifyCodeSchema.parse(req.body);

    const stored = resetCodes.get(email);

    if (!stored) {
      return res.status(400).json({
        message: "Geçersiz kod",
        error: "Kod bulunamadı veya süresi dolmuş",
      });
    }

    if (Date.now() > stored.expiresAt) {
      resetCodes.delete(email);
      return res.status(400).json({
        message: "Kod süresi dolmuş",
        error: "Lütfen yeni bir kod isteyin",
      });
    }

    if (stored.code !== code) {
      return res.status(400).json({
        message: "Geçersiz kod",
        error: "Girdiğiniz kod yanlış",
      });
    }

    // Code verified - return success (code will be used in reset-password)
    res.json({
      message: "Kod doğrulandı",
      verified: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Geçersiz istek",
        errors: error.errors,
      });
    }
    console.error("Verify code error:", error);
    res.status(500).json({
      message: "Kod doğrulama sırasında hata oluştu",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = resetPasswordSchema.parse(req.body);
    const platform = req.headers["x-platform"] as string | undefined;

    // Android için code ile reset
    if (platform === "android") {
      const stored = resetCodes.get(email);

      if (!stored || stored.code !== code || Date.now() > stored.expiresAt) {
        return res.status(400).json({
          message: "Geçersiz veya süresi dolmuş kod",
          error: "Lütfen yeni bir kod isteyin",
        });
      }

      // Supabase'de şifreyi güncelle
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return res.status(400).json({
          message: "Şifre güncellenemedi",
          error: error.message,
        });
      }

      // Code'u sil
      resetCodes.delete(email);

      res.json({
        message: "Şifre başarıyla güncellendi",
      });
    } else {
      // Web için token ile reset (Supabase Auth handle eder)
      return res.status(400).json({
        message: "Web için token ile reset kullanılmalı",
        error: "Use Supabase Auth reset password flow",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Geçersiz istek",
        errors: error.errors,
      });
    }
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Şifre sıfırlama sırasında hata oluştu",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/auth/session
router.get("/session", authenticateRequest, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Yetkisiz erişim",
      });
    }

    res.json({
      user: req.user,
      authenticated: true,
    });
  } catch (error) {
    console.error("Session check error:", error);
    res.status(500).json({
      message: "Session kontrolü sırasında hata oluştu",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;


