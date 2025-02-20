import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black-primary h-fit flex-col-center-start  homepage-padding py-20 ">
      <div className="flex-row-start gap-6 flex-row-start-end">
        <Image
          src={"/logowhite.svg"}
          alt={"footer-logo-svg"}
          width={20}
          height={20}
        />
        <h1 className="text-2xl italic font-bold text-white-secondary">
          LARRY'S HOME DESIGNS
        </h1>
      </div>
      <div className="mt-10 flex-row-start gap-6 flex-row-start">
        <Image
          src={"/homepage/footer-location.svg"}
          alt={"footer-location-svg"}
          width={20}
          height={20}
        />
        <p className="text-white-secondary">
          870 Matthew Dr, Stevens, PA, United States, Pennsylvania
        </p>
      </div>
      <div className="mt-2 flex-row-start gap-6 flex-row-start">
        <Image
          src={"/homepage/footer-phone.svg"}
          alt={"footer-phone-svg"}
          width={20}
          height={20}
        />
        <p className="text-white-secondary">717-989-4491</p>
      </div>
      <div className="mt-2 flex-row-start gap-6 flex-row-start">
        <Image
          src={"/homepage/footer-email.svg"}
          alt={"footer-phone-svg"}
          width={20}
          height={20}
        />
        <p className="text-white-secondary">info@larryshomedesigns.com</p>
      </div>
      <div className="mt-8 flex-col-start gap-2  flex-row-start">
        <p className="text-white-secondary font-bold">Find us on</p>
        <div className="flex-row-start gap-2">
          <Image
            src={"/homepage/footer-fb.svg"}
            alt={"footer-fb-svg"}
            width={20}
            height={20}
          />
          <Image
            src={"/homepage/footer-linkedIn.svg"}
            alt={"footer-linkedIn-svg"}
            width={20}
            height={20}
          />
          <Image
            src={"/homepage/footer-insta.svg"}
            alt={"footer-insta-svg"}
            width={20}
            height={20}
          />
        </div>
      </div>
    </footer>
  );
}
