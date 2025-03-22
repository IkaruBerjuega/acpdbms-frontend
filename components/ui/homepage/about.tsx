import Image from "next/image";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="bg-black-primary flex-row-center homepage-padding lg:h-screen"
    >
      <div className="container">
        <div className="lg:flex lg:items-center">
          <div className="mt-8 lg:mt-0 lg:w-1/2 lg:px-6 flex lg:justify-end justify-center ">
            <Image
              width={500} // Add appropriate width
              height={550}
              className="object-scale-down object-center h-[300px] md:h-[500px] 2xl:h-[700px] rounded-md "
              src="/homepage/about-image.png"
              alt="image-about"
              draggable={false}
            />
          </div>
          <div className="mt-8 lg:mt-0 lg:w-1/2 lg:px-6 ">
            <div>
              <h1 className="text-2xl md:text-5xl 2xl:text-7xl font-bold  text-white-primary">
                About Us
              </h1>
              <p className="lg:max-w-lg text-wrap mt-6 md:text-2xl font-light text-justify lg:text-justify text-white-100 text-white-secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
