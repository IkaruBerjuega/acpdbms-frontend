import Image from "next/image";
import LoginForm from "../../components/ui/login/login-form";
import { LogoResponse } from "@/lib/definitions";
import { publicRequestAPI } from "@/hooks/server-request";

export default async function Login() {
  const logoResponse: LogoResponse | undefined = await publicRequestAPI({
    url: "/settings/logo",
  });

  return (
    <div className='flex items-center justify-center h-screen bg-[url("/bg.png")] bg-cover'>
      <div className="flex w-[90%] h-[80%]  md:w-[70%] md:h-[80%]  lg:max-w-4xl  ">
        <div className="flex-col-center lg:flex-row-start w-full h-full rounded-lg bg-white-primary overflow-hidden">
          <div className="flex-column w-full p-4 lg:w-1/2 lg:p-6">
            <div className="flex justify-center mx-0">
              {!!logoResponse && (
                <Image
                  src={
                    logoResponse?.logo_url ||
                    "/system-component-images/logo-placeholder.webp"
                  }
                  width={150}
                  height={0}
                  draggable={false}
                  alt="Logo"
                />
              )}
            </div>
            <div className="flex justify-center mx-auto mt-8">
              <h1 className="block text-xl lg:text-2xl text-maroon-800">
                WELCOME BACK
              </h1>
            </div>
            <LoginForm />
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
