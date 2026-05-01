<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'nip' => 'required|string|regex:/^[0-9]+$/|unique:users,nip',
            'email' => 'required|email|unique:users,email',
            'unit_kerja' => 'required|string|max:255',
            'telepon' => 'required|string|max:20',
            'password' => 'required|string|min:6|confirmed',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama harus diisi',
            'nip.required' => 'NIP harus diisi',
            'nip.regex' => 'NIP hanya boleh berisi angka',
            'nip.unique' => 'NIP sudah terdaftar',
            'email.required' => 'Email harus diisi',
            'email.email' => 'Email harus mengandung @ dan format yang valid',
            'email.unique' => 'Email sudah terdaftar',
            'unit_kerja.required' => 'Unit Kerja harus diisi',
            'telepon.required' => 'Nomor Telepon harus diisi',
            'telepon.max' => 'Nomor Telepon maksimal 20 karakter',
            'password.required' => 'Password harus diisi',
            'password.min' => 'Password minimal 6 karakter',
            'password.confirmed' => 'Konfirmasi password tidak cocok',
        ];
    }
}
