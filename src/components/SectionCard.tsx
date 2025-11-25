import BlueButton from "./BlueButton";

interface SectionCardProps {
  title: string;
  link: string;
  description: string;
  imageSrc: string;
  imageAlign?: "left" | "right";
  customSizeImage?: string;
  className?: string;
  extendedClassName?: string;
  customColor?: string;
}

const colorMap: Record<string, string> = {
  green: "border-green-200 bg-green-100",
  blue: "border-blue-200 bg-blue-100",
  red: "border-red-200 bg-red-100",
  yellow: "border-yellow-200 bg-yellow-100",
  amber: "border-amber-200 bg-amber-100",
  orange: "border-orange-200 bg-orange-100",
  pink: "border-pink-200 bg-pink-100",
};

const SectionCard = ({
  title,
  link,
  description,
  imageSrc,
  imageAlign = "left",
  customSizeImage = "w-[200px] h-[170px]",
  className,
  extendedClassName = "",
  customColor,
}: SectionCardProps) => {
  return (
    <div
      className={`${
        className ?? `border-2 p-6 rounded-lg w-fit ${extendedClassName}`
      } ${colorMap[customColor] ?? "border-black"}`}
    >
      {imageAlign === "left" ? (
        <div className="flex justify-between gap-20">
          <div className="text-left">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-[2em] font-bold">{title}</h2>
            </div>
            <p className="my-5 text-lg">{description}</p>
            <BlueButton
              label="Learn more"
              onClick={() => (window.location.href = link)}
              extendedClassName="mt-3"
            />
          </div>
          <div>
            <img
              src={imageSrc}
              alt="Card Thumbnail"
              className={customSizeImage}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-between gap-20">
          <div>
            <img
              src={imageSrc}
              alt="Card Thumbnail"
              className={customSizeImage}
            />
          </div>
          <div className="text-right">
            <div className="flex justify-end items-center gap-3 mb-3">
              <h2 className="text-[2em] font-bold">{title}</h2>
            </div>
            <p className="my-5 text-lg text-right">{description}</p>
            <BlueButton
              label="Learn more"
              onClick={() => (window.location.href = link)}
              extendedClassName="mt-3"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default SectionCard;
