export default function RecentProjects() {
  return (
    <section
      id="recent-projects"
      className="w-full h-[125vh] homepage-padding flex flex-col bg-black-primary "
    >
      <div className="w-full xl:h-[20%] flex-row-start-end">
        <h1 className="text-2xl lg:text-5xl 2xl:text-7xl font-bold text-white-secondary">
          Recent Projects
        </h1>
      </div>
      <div className="flex-grow flex-col-between-center lg:flex-row-between-center w-full "></div>
    </section>
  );
}
