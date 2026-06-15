<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Akun B-PASS</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .email-header {
            background-color: #2b3168;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .email-header img {
            max-width: 150px;
        }
        .email-body {
            padding: 30px;
            color: #333333;
            line-height: 1.6;
        }
        .otp-box {
            background-color: #f8f9fa;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #2b3168;
            letter-spacing: 5px;
        }
        .email-footer {
            background-color: #f4f4f4;
            color: #777777;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h2>B-PASS Bea Cukai</h2>
        </div>
        <div class="email-body">
            <p>Halo <strong>{{ $name }}</strong>,</p>
            <p>Terima kasih telah mendaftar di sistem B-PASS (Bea Cukai Personality Assessment).</p>
            <p>Untuk menyelesaikan proses pendaftaran dan memastikan keamanan akun Anda, kami memerlukan verifikasi alamat email ini. Saat Anda melakukan login untuk pertama kalinya, sistem akan meminta kode verifikasi.</p>
            <p>Silakan masukkan 6 digit kode rahasia berikut:</p>
            
            <div class="otp-box">
                <div class="otp-code">{{ $otpCode }}</div>
            </div>
            
            <p><strong>Penting:</strong> Kode ini hanya berlaku selama 10 menit. Harap jangan memberikan kode ini kepada siapapun, termasuk pihak administrator.</p>
            <p>Jika Anda tidak merasa mendaftar di sistem B-PASS, Anda dapat mengabaikan email ini dengan aman.</p>
            
            <p>Terima kasih,<br>Tim Administrator B-PASS<br>Direktorat Jenderal Bea dan Cukai</p>
        </div>
        <div class="email-footer">
            &copy; {{ date('Y') }} Direktorat Jenderal Bea dan Cukai. Hak Cipta Dilindungi.
        </div>
    </div>
</body>
</html>
