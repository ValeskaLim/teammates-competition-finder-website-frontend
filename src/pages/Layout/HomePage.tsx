import SectionCard from "../../components/SectionCard";
import WelcomeMessage from "../../components/WelcomeMessage";
import { useAuth } from "../../hooks/AuthProvider";
import { ROUTE_PATHS } from "../../router/routePaths";

const HomePage = () => {
  const { users } = useAuth();

  return (
    <div className="main-container px-4 sm:px-8 lg:mx-20 2xl:mx-40">
      <div className="main-col-container items-center text-center">
        <img
          src="logo.png"
          alt="Logo"
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52"
        />
        <h1 className="text-4xl sm:text-5xl font-bold my-6 sm:my-8">
          Welcome to Sunib HALL
        </h1>
        <WelcomeMessage user={users?.fullname} />
        <p className="text-xl sm:text-2xl md:text-3xl text-center mt-10 italic px-2">
          "Your all-in-one platform to find and join competitions with ease!"
        </p>
        <div className="w-full flex flex-col gap-12 mt-20">
          <div className="flex">
            <SectionCard
              title="Find & Join Competition Now"
              link={ROUTE_PATHS.COMPETITION}
              description="Find and join competitions that suit you best."
              imageSrc="undoukai_trophy.png"
              customColor="red"
              customSizeImage="w-[200px] h-[160px] sm:w-[250px] sm:h-[200px]"
            />
          </div>
          <div className="flex justify-end">
            <SectionCard
              title="Find Team Members"
              link={ROUTE_PATHS.FIND}
              description="Find member criteria that suit you best and invite them to join your team."
              imageSrc="friends_man.png"
              extendedClassName="justify-items-end"
              imageAlign="right"
              customSizeImage="w-[220px] h-[160px] sm:w-[300px] sm:h-[200px]"
              customColor="orange"
            />
          </div>
          <div className="flex justify-start">
            <SectionCard
              title="Teammates List"
              link={ROUTE_PATHS.TEAMMATES_LIST}
              description="View your team and teammates details."
              imageSrc="online_kaigi_man.png"
              customSizeImage="w-[230px] h-[100px] sm:w-[300px] sm:h-[250px]"
              customColor="green"
            />
          </div>
          <div className="flex justify-end">
            <SectionCard
              title="Your Profile"
              link={ROUTE_PATHS.PROFILE}
              description="View and edit your profile information."
              imageSrc="mirror_woman_smile.png"
              extendedClassName="justify-items-end"
              imageAlign="right"
              customSizeImage="w-[220px] h-[220px] sm:w-[250px] sm:h-[250px]"
              customColor="pink"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
