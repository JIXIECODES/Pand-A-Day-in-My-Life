import authPanda from "../../../assets/auth/auth-panda.svg";

export default function PandaAuthGraphic() {
  return (
    <div
      className="mx-auto flex h-64 w-full max-w-[320px] items-center justify-center"
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