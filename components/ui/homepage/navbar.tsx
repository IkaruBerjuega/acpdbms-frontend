"use client";

import Link from "next/link";
import { Button, ButtonLink } from "../button";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isMobileNavOpen, setisMobileNavOpen] = useState<boolean>(false);

  const items = [
    {
      name: "Home",
      link: "#hero",
    },
    {
      name: "About",
      link: "#about",
    },
    {
      name: "Process",
      link: "#process",
    },
    {
      name: "Recent Projects",
      link: "#recent-projects",
    },
  ];

  const buttonItems = [
    {
      name: "Log in",
      variant: "default",
      link: "/login",
    },
  ];

  return (
    <>
      <nav className="hidden lg:flex-row-between-center w-full shadow-sm relative lg:fixed homepage-nav-bar-padding bg-white-primary  z-50">
        <div className="hidden lg:flex gap-6 text-md leading-none">
          {items.map((item, index) => (
            <Link key={index} href={item.link}>
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex space-x-4 font-semibold">
          {buttonItems.map((item, index) => (
            <ButtonLink
              key={index}
              variant={item.name === "Log in" ? "default" : "outline"}
              href={item.link}
              className="font-semibold text-md"
            >
              {item.name}
            </ButtonLink>
          ))}
        </div>
      </nav>
      <Button
        className="lg:hidden fixed top-2 right-2 z-50 p-0 bg-transparent focus:bg-transparent"
        variant={"ghost"}
        onClick={() => setisMobileNavOpen(!isMobileNavOpen)}
      >
        <Image
          src={"/homepage/nav-hamburger.svg"}
          alt={"menu button"}
          width={30}
          height={30}
        />
      </Button>
      <div
        className={`fixed h-screen w-full flex-col-center bg-white-primary transform  transition-transform duration-300  gap-2 ${
          isMobileNavOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className="text-lg"
            onClick={() => setisMobileNavOpen(false)}
          >
            {item.name}
          </Link>
        ))}
        <div className="mt-10" />
        {buttonItems.map((item, index) => (
          <ButtonLink
            key={index}
            variant={item.name === "Log in" ? "default" : "outline"}
            href={item.link}
            className="font-semibold text-md"
          >
            {item.name}
          </ButtonLink>
        ))}
      </div>
    </>
  );
}
