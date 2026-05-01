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
        .section-title {
            color: #2d3269;
            font-size: 15px;
            font-weight: 700;
            margin: 25px 0 15px 0;
            border-bottom: 2px solid #FFCA08;
            padding-bottom: 8px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .info-table tr {
            border-bottom: 1px solid #e0e0e0;
        }
        .info-table tr:last-child {
            border-bottom: none;
        }
        .info-table td {
            padding: 10px 0;
            font-size: 13px;
        }
        .info-table td:first-child {
            font-weight: 700;
            color: #2d3269;
            width: 35%;
            vertical-align: top;
        }
        .info-table td:last-child {
            color: #555;
            word-break: break-word;
            padding-left: 15px;
        }
        .credential-box {
            background: #f0f4ff;
            border-left: 4px solid #4A569D;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
            font-size: 13px;
        }
        .credential-box strong {
            color: #2d3269;
            display: block;
            font-weight: 700;
            margin-bottom: 4px;
        }
        .credential-box span {
            color: #333;
            font-family: 'Courier New', monospace;
            background: white;
            padding: 6px 8px;
            border-radius: 3px;
            display: block;
        }
        .steps-list {
            background: #f9f9f9;
            padding: 15px 15px 15px 30px;
            border-left: 4px solid #4A569D;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .steps-list li {
            margin: 8px 0;
            font-size: 13px;
            line-height: 1.5;
            color: #555;
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
            <h1>Akun Anda Berhasil Dibuat</h1>
            <p>DISC Self-Assessment Platform</p>
        </div>

        <div class="content">
            <div class="greeting">
                <p>Halo {{ $user->name }},</p>
                <p>Terima kasih telah mendaftar di platform DISC Self-Assessment. Kami dengan senang hati menyambut Anda sebagai bagian dari komunitas kami. Akun Anda sudah siap untuk digunakan kapan saja.</p>
            </div>

            <div class="section-title">Data Akun Anda</div>
            <table class="info-table">
                <tr>
                    <td>Nama</td>
                    <td>{{ $user->name }}</td>
                </tr>
                <tr>
                    <td>NIP</td>
                    <td>{{ $user->nip }}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{{ $user->email }}</td>
                </tr>
                <tr>
                    <td>Unit Kerja</td>
                    <td>{{ $user->unit_kerja }}</td>
                </tr>
                <tr>
                    <td>Telepon</td>
                    <td>{{ $user->telepon }}</td>
                </tr>
            </table>

            <div class="section-title">Informasi Login</div>
            <div class="credential-box">
                <strong>Email:</strong>
                <span>{{ $user->email }}</span>
            </div>
            <div class="credential-box">
                <strong>Password:</strong>
                <span>{{ $password }}</span>
            </div>

            <div class="section-title">Langkah Berikutnya</div>
            <ol class="steps-list">
                <li>Kunjungi aplikasi DISC Self-Assessment kami</li>
                <li>Login dengan email dan password yang telah diberikan di atas</li>
                <li>Ikuti instruksi untuk mulai tes DISC Self-Assessment</li>
            </ol>

            <div class="warning">
                <strong>Catatan Penting:</strong>
                Jaga kerahasiaan password Anda dan jangan bagikan dengan siapa pun. Jika diperlukan, Anda dapat mengganti password melalui pengaturan akun setelah login.
            </div>

            <p style="font-size: 13px; color: #666; line-height: 1.6; margin: 20px 0;">
                Apabila ada kendala atau pertanyaan, jangan ragu untuk menghubungi tim dukungan kami melalui email ini atau melalui aplikasi.
            </p>
        </div>

        <div class="footer">
            <p>Email ini dikirim secara otomatis. Silakan hubungi kami jika ada yang ingin ditanyakan.</p>
            <p>&copy; 2026 Bea dan Cukai. Semua hak dilindungi.</p>
            <p style="margin-top: 10px;">DISC Self-Assessment Platform</p>
        </div>
    </div>
</body>
</html>
