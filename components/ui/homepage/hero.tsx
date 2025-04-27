"use client";

import { ButtonLink } from "../button";
import Image from "next/image";

export default function Hero({ logoUrl }: { logoUrl: string | undefined }) {
  return (
    <section
      id="home"
      className="w-full flex h-screen bg-image-hero homepage-padding "
    >
      <div className=" w-full h-full xl:w-1/2 lg:mt-10 flex-col-center lg:flex-row-start-center">
        <div className="h-[40%] md:h-[50%]  xl:h-[60%] flex-col-start  gap-4 ">
          <Image
            src={logoUrl || "/system-component-images/logo-placeholder.webp"}
            alt={""}
            width={10000}
            height={10000}
            quality={100}
            draggable={false}
            className="object-contain w-full h-full"
          />

          <div className="w-full">
            <ButtonLink
              href={"#contact-form"}
              size={"lg"}
              className="font-semibold md:text-xl"
            >
              Contact Us
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
