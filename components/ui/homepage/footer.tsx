"use client";

import { Separator } from "../separator";
import Image from "next/image";
import { Fragment } from "react";
import { DynamicContactSchema } from "@/lib/definitions";
import Link from "next/link";

export default function Footer({
  logoUrl,
  contactDetails,
}: {
  logoUrl: string | undefined;
  contactDetails: DynamicContactSchema["contact_details"];
}) {
  const email = contactDetails.find(
    (contact) => contact.type === "email"
  )?.value;

  const contactNumbers =
    contactDetails.filter((contact) => contact.type === "contact_number") || [];

  const address = contactDetails.find(
    (contact) => contact.type === "address"
  )?.value;

  const facebookLink = contactDetails.find(
    (contact) => contact.type === "facebook"
  )?.value;

  const instagramLink = contactDetails.find(
    (contact) => contact.type === "instagram"
  )?.value;

  const linkedInLink = contactDetails.find(
    (contact) => contact.type === "linkedin"
  )?.value;

  return (
    <footer className="bg-black-primary h-fit flex-col-center-start  homepage-padding py-20 ">
      <div className="flex-row-start-center gap-6">
        <div className="p-1 bg-white-primary/40 rounded-md">
          <Image
            src={logoUrl || "/system-component-images/logo-placeholder.webp"}
            alt={"footer-logo-svg"}
            width={30}
            height={30}
          />
        </div>

        <h1 className="text-2xl italic font-bold text-white-secondary">
          LARRY&apos;S HOME DESIGNS
        </h1>
      </div>
      <div className="mt-10 flex-row-start gap-6 flex-row-start">
        <Image
          src={"/homepage/footer-location.svg"}
          alt={"footer-location-svg"}
          width={20}
          height={20}
        />
        <p className="text-white-secondary">{address || "Not Set Yet"}</p>
      </div>
      <div className="mt-2 flex-row-start gap-6 flex-row-start">
        <Image
          src={"/homepage/footer-phone.svg"}
          alt={"footer-phone-svg"}
          width={20}
          height={20}
        />

        <div className="flex-row-start-center gap-1 flex-wrap text-white-secondary">
          {contactNumbers.length > 0
            ? contactNumbers.map((no, index) => (
                <Fragment key={no.id}>
                  {index > 0 && <Separator orientation="vertical" />}
                  <p>{no.value}</p>
                </Fragment>
              ))
            : "Not Set Yet"}
        </div>
      </div>
      <div className="mt-2 flex-row-start gap-6 flex-row-start">
        <Image
          src={"/homepage/footer-email.svg"}
          alt={"footer-phone-svg"}
          width={20}
          height={20}
        />
        <p className="text-white-secondary">{email || "Not Set Yet"}</p>
      </div>

      {!!facebookLink ||
        !!instagramLink ||
        (!!linkedInLink && (
          <div className="mt-8 flex-col-start gap-4  flex-row-start">
            <p className="text-white-secondary font-bold">Find us on</p>
            <div className="flex-row-start gap-4">
              {!!facebookLink && (
                <Link href={facebookLink}>
                  <Image
                    src={"/homepage/footer-fb.svg"}
                    alt={"footer-fb-svg"}
                    width={20}
                    height={20}
                  />
                </Link>
              )}

              {!!instagramLink && (
                <Link href={instagramLink}>
                  <Image
                    src={"/homepage/footer-linkedIn.svg"}
                    alt={"footer-linkedIn-svg"}
                    width={20}
                    height={20}
                  />
                </Link>
              )}

              {!!linkedInLink && (
                <Link href={linkedInLink}>
                  <Image
                    src={"/homepage/footer-insta.svg"}
                    alt={"footer-insta-svg"}
                    width={20}
                    height={20}
                  />
                </Link>
              )}
            </div>
          </div>
        ))}
    </footer>
  );
}
