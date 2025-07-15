// 'use client';

// import { useState } from 'react';
// import axios from 'axios';

// export default function RegisterPage() {
//   const [form, setForm] = useState({
//     username: '',
//     password: '',
//     role: 'staff',
//     phone: '',
//     otp: ''
//   });

//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));

//     if (name === 'phone') {
//       setOtpSent(false);
//       setOtpVerified(false);
//       setError('');
//       setSuccess('');
//       setForm(prev => ({ ...prev, otp: '' }));
//     }
//   };

//   const sendOtp = async () => {
//     setError('');
//     setSuccess('');

//     if (!/^\d{10}$/.test(form.phone)) {
//       setError('Enter a valid 10-digit mobile number.');
//       return;
//     }

//     try {
//       const formattedPhone = `+91${form.phone}`;
//       await axios.post('https://new-crm-sdcn.onrender.com/api/send-otp', { phone: formattedPhone });
//       setOtpSent(true);
//       setSuccess('OTP sent successfully!');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to send OTP.');
//     }
//   };

//   const verifyOtp = async () => {
//     setError('');
//     setSuccess('');

//     if (form.otp.length !== 6) {
//       setError('Enter a valid 6-digit OTP.');
//       return;
//     }

//     try {
//       const formattedPhone = `+91${form.phone}`;
//       await axios.post('https://new-crm-sdcn.onrender.com/api/verify-otp', {
//         phone: formattedPhone,
//         code: form.otp
//       });
//       setOtpVerified(true);
//       setSuccess('OTP verified successfully!');
//     } catch (err) {
//       setError(err.response?.data?.message || 'OTP verification failed.');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!otpVerified) {
//       setError('Please verify OTP before submitting.');
//       return;
//     }

//     try {
//       const formattedPhone = `+91${form.phone}`;
//       const res = await axios.post('https://new-crm-sdcn.onrender.com/api/auth/register', {
//         username: form.username,
//         password: form.password,
//         role: form.role,
//         phone: formattedPhone
//       });

//       setSuccess(res.data.message || 'Registered successfully. Awaiting admin approval.');
//       setForm({ username: '', password: '', role: 'staff', phone: '', otp: '' });
//       setOtpSent(false);
//       setOtpVerified(false);

     
//       setTimeout(() => {
//         window.location.href = '/login';
//       }, 3000);

//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed.');
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Register</h2>
//       <form onSubmit={handleSubmit}>
//         <label>Username</label>
//         <input
//           name="username"
//           placeholder="Enter your username"
//           value={form.username}
//           onChange={handleChange}
//           required
//         />

//         <label>Password</label>
//         <input
//           name="password"
//           type="password"
//           placeholder="Enter your password"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />

//         <label>Role</label>
//         <select name="role" value={form.role} onChange={handleChange} required>
//           <option value="staff">Staff</option>
//           <option value="technician">Technician</option>
//         </select>

//         <label>Mobile Number</label>
//         <div className="input-row">
//           <input
//             name="phone"
//             placeholder="10-digit number"
//             value={form.phone}
//             onChange={handleChange}
//             maxLength={10}
//             inputMode="numeric"
//             required
//           />
//           <button type="button" className="secondary" onClick={sendOtp} disabled={otpSent}>
//             {otpSent ? 'OTP Sent' : 'Send OTP'}
//           </button>
//         </div>

//         {otpSent && (
//           <>
//             <label>Enter OTP</label>
//             <div className="input-row">
//               <input
//                 name="otp"
//                 placeholder="6-digit OTP"
//                 value={form.otp}
//                 onChange={handleChange}
//                 maxLength={6}
//                 inputMode="numeric"
//                 required
//               />
//               <button type="button" className="secondary" onClick={verifyOtp} disabled={otpVerified}>
//                 {otpVerified ? 'Verified' : 'Verify'}
//               </button>
//             </div>
//           </>
//         )}

//         <button type="submit" className="primary" disabled={!otpVerified}>
//           Register
//         </button>
//       </form>

//       {error && <p className="error">{error}</p>}
//       {success && <p className="success">{success}</p>}

//       <style jsx>{`
//         .container {
//           max-width: 480px;
//           margin: 60px auto;
//           padding: 40px;
//           background: #f9f9f9;
//           border-radius: 16px;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
//         }
//         h2 {
//           text-align: center;
//           margin-bottom: 30px;
//           font-size: 26px;
//         }
//         form {
//           display: flex;
//           flex-direction: column;
//           gap: 15px;
//         }
//         label {
//           font-weight: 500;
//           margin-bottom: 5px;
//         }
//         input, select {
//           padding: 12px 14px;
//           font-size: 16px;
//           border: 1.5px solid #ccc;
//           border-radius: 8px;
//           outline: none;
//         }
//         .input-row {
//           display: flex;
//           gap: 10px;
//         }
//         .primary, .secondary {
//           padding: 12px;
//           border-radius: 8px;
//           font-weight: 600;
//           cursor: pointer;
//         }
//         .primary {
//           background-color: #0070f3;
//           color: white;
//           border: none;
//         }
//         .secondary {
//           background-color: #e0e0e0;
//           color: #333;
//           border: none;
//         }
//         button:disabled {
//           background-color: #aaa;
//           cursor: not-allowed;
//         }
//         .error {
//           color: #d93025;
//           margin-top: 20px;
//           text-align: center;
//         }
//         .success {
//           color: #188038;
//           margin-top: 20px;
//           text-align: center;
//         }
//       `}</style>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'staff',
    phone: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formattedPhone = `+968${form.phone}`;
      const res = await axios.post('https://new-crm-sdcn.onrender.com/api/auth/register', {
        username: form.username,
        password: form.password,
        role: form.role,
        phone: formattedPhone
      });

      setSuccess(res.data.message || 'Registered successfully. Awaiting admin approval.');
      setForm({ username: '', password: '', role: 'staff', phone: '' });

      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          name="username"
          placeholder="Enter your username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="staff">Staff</option>
          <option value="technician">Technician</option>
        </select>

        <label>Mobile Number</label>
        <input
          name="phone"
          placeholder="10-digit number"
          value={form.phone}
          onChange={handleChange}
          maxLength={10}
          inputMode="numeric"
          required
        />

        <button type="submit" className="primary">
          Register
        </button>
      </form>
         <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/" className="text-blue-600 font-semibold">Login</Link>
        </p>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <style jsx>{`
        .container {
          max-width: 480px;
          margin: 60px auto;
          padding: 40px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        h2 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 26px;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        label {
          font-weight: 500;
          margin-bottom: 5px;
        }
        input, select {
          padding: 12px 14px;
          font-size: 16px;
          border: 1.5px solid #ccc;
          border-radius: 8px;
          outline: none;
        }
        .primary {
          padding: 12px;
          border-radius: 8px;
          font-weight: 600;
          background-color: #0070f3;
          color: white;
          border: none;
          cursor: pointer;
        }
        .error {
          color: #d93025;
          margin-top: 20px;
          text-align: center;
        }
        .success {
          color: #188038;
          margin-top: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
