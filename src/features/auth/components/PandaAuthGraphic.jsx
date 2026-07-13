import authPanda from "../../../assets/auth/auth-panda.svg";

export default function PandaAuthGraphic() {
  return (
    <div
      className="mx-auto flex aspect-square h-[min(34dvh,20rem)] w-auto max-w-full items-center justify-center lg:h-[min(48dvh,28rem)]"
      role="img"
      aria-label="Panda holding bamboo"
    >
      <img
        src={authPanda}
        alt="Panda holding bamboo"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
