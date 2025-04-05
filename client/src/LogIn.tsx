import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must contain at least 8 characters' }),
});

type FormFields = z.infer<typeof schema>;

const LogIn = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const passwordVisibilityIcon = passwordVisibility ? (
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(data);
    } catch (error) {
      setError('root', {
        message: 'This email is already taken',
      });
    }
  };

  return (
    <>
      <p className="text-red-400 text-xl font-bold mt-5 mb-1 drop-shadow-xs">
        Log in
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
        <button
          className="bg-red-400 hover:bg-red-300 disabled:bg-gray-900 disabled:text-gray-600 transition-colors duration-300 ease-in-out text-white text-lg font-bold mt-3 px-4 py-2 rounded-full shadow-md drop-shadow-md cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
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
          <p className="text-center text-red-500 text-xs drop-shadow-md mt-2 ">
            {errors.root.message}
          </p>
        ) : null}
      </form>
      <p className="hover:text-red-400 transition-colors duration-300 ease-in-out text-xs mt-3 cursor-pointer">
        Register
      </p>
    </>
  );
};

export default LogIn;
