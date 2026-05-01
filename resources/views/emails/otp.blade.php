<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #4A569D 0%, #2d3269 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .header p {
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 14px;
            margin-bottom: 25px;
            line-height: 1.6;
            color: #333;
        }
        .otp-box {
            background: #f0f4ff;
            border-left: 4px solid #FFCA08;
            padding: 25px;
            margin: 25px 0;
            border-radius: 8px;
            text-align: center;
        }
        .otp-box h3 {
            color: #2d3269;
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .otp-code {
            font-size: 32px;
            font-weight: 800;
            color: #4A569D;
            letter-spacing: 3px;
            font-family: 'Courier New', monospace;
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 2px dashed #FFCA08;
        }
        .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            font-size: 13px;
            color: #856404;
            line-height: 1.6;
        }
        .warning strong {
            display: block;
            margin-bottom: 8px;
            font-weight: 700;
        }
        .info-text {
            font-size: 13px;
            color: #666;
            margin: 20px 0;
            line-height: 1.6;
        }
        .footer {
            background: #f9f9f9;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #999;
            line-height: 1.6;
        }
        .footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Password</h1>
            <p>DISC Self-Assessment Platform</p>
        </div>

        <div class="content">
            <div class="greeting">
                <p>Halo {{ $user->name }},</p>
                <p>Kami menerima permintaan untuk mereset password akun Anda. Berikut adalah kode OTP (One Time Password) untuk melanjutkan proses reset password:</p>
            </div>

            <div class="otp-box">
                <h3>Kode OTP Anda</h3>
                <div class="otp-code">{{ $otp }}</div>
            </div>

            <div class="info-text">
                <p><strong>Catatan Penting:</strong></p>
                <ul style="margin-left: 20px; margin-top: 10px;">
                    <li>Kode OTP ini berlaku selama <strong>10 menit</strong></li>
                    <li>Kode OTP hanya dapat digunakan <strong>satu kali</strong></li>
                    <li>Jangan bagikan kode OTP ini kepada siapa pun</li>
                    <li>Jika Anda tidak melakukan permintaan ini, abaikan email ini</li>
                </ul>
            </div>

            <div class="warning">
                <strong>Keamanan Akun:</strong>
                Jika Anda tidak melakukan permintaan reset password, segera ganti password Anda atau hubungi tim dukungan kami.
            </div>

            <p style="font-size: 12px; color: #999; margin-top: 20px;">
                Email ini dikirim secara otomatis. Jangan membalas email ini karena inbox ini tidak dipantau.
            </p>
        </div>

        <div class="footer">
            <p>Email ini dikirim secara otomatis karena ada permintaan reset password.</p>
            <p>&copy; 2026 Bea dan Cukai. Semua hak dilindungi.</p>
            <p style="margin-top: 10px;">DISC Self-Assessment Platform</p>
        </div>
    </div>
</body>
</html>
