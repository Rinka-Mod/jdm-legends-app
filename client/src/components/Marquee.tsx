/** JDM LEGENDS — Dải chữ chạy. © 2026 Rinka-Mod */

const NAMES = [
  "SUPRA",
  "SKYLINE GT-R",
  "RX-7",
  "NSX",
  "LANCER EVO",
  "IMPREZA 22B",
  "SILVIA S15",
  "AE86",
  "CIVIC TYPE R",
  "CHASER",
  "FAIRLADY Z",
  "350Z",
];

function Run() {
  return (
    <span>
      {NAMES.map((name) => (
        <span key={name}>
          {name} <i>·</i>{" "}
        </span>
      ))}
    </span>
  );
}

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <Run />
        <Run />
      </div>
    </div>
  );
}
