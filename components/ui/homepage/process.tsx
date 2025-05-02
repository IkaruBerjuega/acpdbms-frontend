import Image from "next/image";
import { Fragment } from "react";

interface ProcessCardInterface {
  image: string;
  title: string;
  description: string;
}

function ProcessCard({ image, title, description }: ProcessCardInterface) {
  return (
    <div className="h-fit  bg-white-primary p-5 xl:p-10  flex-col-start space-y-5  rounded-xl text-black-primary shadow-md font-semibold">
      <div className="space-y-6">
        <Image
          src={image}
          alt={image + title}
          width={80}
          draggable={false}
          height={80}
        />

        <h1 className="text-xl md:text-2xl lg:text-3xl">{title}</h1>
      </div>
      <div className="flex-row-start font-normal">
        <p className="text-sm xl:text-lg ">{description}</p>
      </div>
    </div>
  );
}

export default function Process() {
  const processItems: ProcessCardInterface[] = [
    {
      image: "/homepage/process-chat-bubble.svg",
      title: "Consult",
      description:
        "We begin with a personalized consultation to understand your vision, needs, and lifestyle. Whether we meet in person or connect remotely, we make sure your ideas are fully understood because this is your home and it should reflect your personality and preferences.",
    },
    {
      image: "/homepage/process-pencil.svg",
      title: "Design",
      description:
        "In the design phase, we create detailed preliminary plans that include floor layouts and exterior views. You will review the designs, give feedback, and we will make the necessary revisions to ensure everything aligns with your space and goals. ",
    },
  ];

  const isLastIteration = processItems.length - 1;

  return (
    <section
      id="process"
      className="w-full h-fit xl:h-screen homepage-padding flex flex-col bg-white-secondary gap-4"
    >
      <div className="w-full xl:h-[15%] flex-row-start-end">
        <h1 className="text-2xl md:text-5xl 2xl:text-7xl font-bold">
          Our Process
        </h1>
      </div>
      <div className="lg:flex-grow flex-col-center xl:flex-row-between-center gap-10">
        {processItems.map((item, index) => {
          return (
            <Fragment key={index}>
              <ProcessCard
                key={index}
                image={item.image}
                title={item.title}
                description={item.description}
              />
              {index != isLastIteration && (
                <>
                  <Image
                    src={"/homepage/process-arrow.svg"}
                    height={40}
                    width={40}
                    alt={"arrow" + index}
                    className="hidden xl:flex"
                  />
                  <Image
                    src={"/homepage/process-arrow-bottom.svg"}
                    height={40}
                    width={40}
                    alt={"arrow" + index}
                    className="xl:hidden"
                  />
                </>
              )}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
