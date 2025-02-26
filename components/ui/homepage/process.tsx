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
        <p className="text-sm xl:text-xl ">{description}</p>
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
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet laoreet magna. Cras feugiat ante et erat accumsan, at congue orci consectetur. ",
    },
    {
      image: "/homepage/process-pencil.svg",
      title: "Design",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet laoreet magna. Cras feugiat ante et erat accumsan, at congue orci consectetur. ",
    },
    {
      image: "/homepage/process-hammer.svg",
      title: "Build",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet laoreet magna. Cras feugiat ante et erat accumsan, at congue orci consectetur. ",
    },
  ];

  const isLastIteration = processItems.length - 1;

  return (
    <section
      id="process"
      className="w-full h-fit xl:h-screen homepage-padding flex flex-col bg-white-secondary gap-4"
    >
      <div className="w-full xl:h-[20%] flex-row-start-end">
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
