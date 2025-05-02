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
              <p className="lg:max-w-lg text-wrap mt-6 md:text-lg font-light text-justify lg:text-justify text-white-100 text-white-secondary">
                Larry&apos;s Home Designs began unexpectedly from a passion for
                home design and a family background in construction. Over the
                past 20 years, we have grown from drawing plans for relatives to
                creating custom residential and light commercial designs across
                Pennsylvania. We specialize in code compliant plans for various
                building styles such as timber frame, log homes, and green
                construction, all tailored to each client&apos;s vision. Our
                mission is to help bring your dream home to life with accuracy,
                care, and efficiency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
