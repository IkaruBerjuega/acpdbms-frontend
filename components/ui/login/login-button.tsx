interface LoginButtonProps {
  loading: boolean;
}

export default function LoginButton({ loading }: LoginButtonProps) {
  return (
    <button
      type='submit'
      className='w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white bg-gray-400 rounded-lg hover:bg-gray-500'
      disabled={loading}
    >
      {loading ? 'Logging in...' : 'LOG IN'}
    </button>
  );
}
