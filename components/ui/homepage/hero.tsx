import { ButtonLink } from "../button";
import Image from "next/image";

export default function Hero({}) {
  return (
    <section
      id="home"
      className="w-full flex h-screen bg-image-hero homepage-padding "
    >
      <div className=" w-full h-full xl:w-1/2 lg:mt-10 flex-col-center lg:flex-row-start-center">
        <div className="h-[40%] md:h-[50%]  xl:h-[80%] flex-col-start aspect-square gap-4">
          <Image
            src={"/red-logo-name.svg"}
            alt={""}
            width={20}
            height={20}
            quality={80}
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
