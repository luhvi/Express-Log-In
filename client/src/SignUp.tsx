import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(8, {
      message: 'Confirm password must be at least 8 characters',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormFields = z.infer<typeof schema>;

const SignUp = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const passwordVisibilityIcon = passwordVisibility ? (
    <i className="fa-solid fa-eye w-4"></i>
  ) : (
    <i className="fa-solid fa-eye-slash w-4"></i>
  );

  const confirmPasswordVisibilityIcon = confirmPasswordVisibility ? (
    <i className="fa-solid fa-eye w-4"></i>
  ) : (
    <i className="fa-solid fa-eye-slash w-4"></i>
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      email: 'someone@example.com',
      password: '12345678',
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Signup failed');
      }

      localStorage.setItem('authToken', result.token);
      localStorage.setItem('userEmail', data.email);

      setTimeout(() => {
        setIsLoading(false);
        navigate('/landing-page');
      }, 1000);
    } catch (error: any) {
      setTimeout(() => {
        setError('root', {
          message: error.message || 'Something went wrong',
        });
      }, 1000);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col align-center text-center w-75 h-95 px-10 rounded-md shadow-[0_0_5px_rgba(0,0,0,0.1)]">
      <p className="text-red-400 text-xl font-bold mt-5 mb-1 drop-shadow-xs">
        Sign Up
      </p>
      <form
        className="flex flex-col align-center justify-center text-left"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col align-center justify-center mb-3">
          <label className="text-sm" htmlFor="email">
            Email
          </label>
          <input
            className="outline-none text-sm w-55 pl-2 pr-3 py-1 rounded-xs shadow-[0_0_5px_rgba(0,0,0,0.1)] drop-shadow-md"
            {...register('email')}
            type="email"
            name="email"
          />
          {errors.email ? (
            <p className="text-red-500 text-xs drop-shadow-md">
              {errors.email.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col align-center justify-center mb-3">
          <label className="text-sm" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              className="outline-none text-sm w-55 pl-2 pr-6 py-1 rounded-xs shadow-[0_0_5px_rgba(0,0,0,0.1)] drop-shadow-md"
              {...register('password')}
              type={passwordVisibility ? 'text' : 'password'}
              name="password"
            />
            <button
              className="absolute top-1/2 right-1.5 -translate-y-1/2 hover:text-red-500 transition-colors duration-300 ease-in-out text-xs drop-shadow-md cursor-pointer"
              onClick={() =>
                setPasswordVisibility((prevVisibility) => !prevVisibility)
              }
              type="button"
            >
              {passwordVisibilityIcon}
            </button>
          </div>
          {errors.password ? (
            <p className="text-red-500 text-xs drop-shadow-md">
              {errors.password.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col align-center justify-center mb-3">
          <label className="text-sm" htmlFor="password">
            Confirm Password
          </label>
          <div className="relative">
            <input
              className="outline-none text-sm w-55 pl-2 pr-6 py-1 rounded-xs shadow-[0_0_5px_rgba(0,0,0,0.1)] drop-shadow-md"
              {...register('confirmPassword')}
              type={confirmPasswordVisibility ? 'text' : 'password'}
              name="confirmPassword"
            />
            <button
              className="absolute top-1/2 right-1.5 -translate-y-1/2 hover:text-red-500 transition-colors duration-300 ease-in-out text-xs drop-shadow-md cursor-pointer"
              onClick={() =>
                setConfirmPasswordVisibility(
                  (prevVisibility) => !prevVisibility
                )
              }
              type="button"
            >
              {confirmPasswordVisibilityIcon}
            </button>
          </div>
          {errors.confirmPassword ? (
            <p className="text-red-500 text-xs drop-shadow-md">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>
        <button
          className="bg-red-400 hover:bg-red-300 disabled:bg-gray-900 disabled:text-gray-600 transition-colors duration-300 ease-in-out text-white text-lg font-bold mt-3 px-4 py-2 rounded-full shadow-md drop-shadow-md cursor-pointer"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? (
            <div>
              Loading {''}
              {
                <i className="fa-solid fa-spinner animate-spin drop-shadow-md"></i>
              }
            </div>
          ) : (
            'Submit'
          )}
        </button>
        {errors.root ? (
          <p className="text-center text-red-500 text-xs drop-shadow-md mt-2 "></p>
        ) : null}
      </form>
      <p
        className="hover:text-red-400 transition-colors duration-300 ease-in-out text-xs mt-3 cursor-pointer"
        onClick={() => navigate('/login')}
      >
        Already have an account? Log In
      </p>
    </div>
  );
};

export default SignUp;
