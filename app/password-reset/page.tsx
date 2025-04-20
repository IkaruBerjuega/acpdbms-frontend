import Image from "next/image";
import PasswordResetForm from "@/components/ui/password-reset/password-reset";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ token: string | null; email: string | null }>;
}) {
  const { token, email } = await searchParams;
  return (
    <div className='flex items-center justify-center h-screen bg-[url("/bg.png")] bg-cover'>
      <div className="flex w-[90%] h-[80%]  md:w-[70%] md:h-[60%] lg:h-[70%] lg:max-w-4xl  ">
        <div className="flex-col-center lg:flex-row-start w-full h-full rounded-lg bg-white-primary overflow-hidden">
          <div className="flex-column w-full p-4 lg:w-1/2 lg:p-6">
            <div className="flex justify-center mx-0">
              <Image
                src="/red-logo-name.svg"
                width={150}
                height={0}
                draggable={false}
                alt="Logo"
              />
            </div>
            <div className="flex justify-center mx-auto mt-8">
              <h1 className="block text-xl lg:text-2xl text-maroon-800">
                Reset Password
              </h1>
            </div>
            <PasswordResetForm token={token} email={email} />
          </div>
          {/* right side of the login page */}
          <div className="hidden h-full lg:flex lg:w-1/2 bg-eerieblack relative">
            <Image
              src="/login-building.png"
              width={442}
              height={600}
              style={{ objectFit: "contain" }}
              draggable={false}
              alt="Building"
              className="absolute right-0 bottom-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
