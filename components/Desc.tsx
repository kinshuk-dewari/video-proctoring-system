import Card from "./ui/Card"

export default function Desc(){
  return (
    <section className="w-full flex flex-col items-center py-20">
      <div className="flex items-end gap-3 mb-10">
        <h1 className="text-3xl text-[#EDEDED] font-bold">
          What&apos;s in Proctored?
        </h1>
        <p className="text-xl text-[#888888] text-center">
          Everything you need from a proctored system
        </p>
      </div>
      <div className="grid gap-7 md:grid-cols-3 grid-cols-1 w-full max-w-7xl px-6">
        <Card
            imageSrc="/interviewer.png"
            title="Interviewer"
            desc="Create a room, Take one on one interviews, with our proctored assist. "
        />
        <Card
            imageSrc="/proctoring-system.png"
            title="Candidate"
            desc="Join an interview, under the protection of our proctored environment."
        />
        <Card
            imageSrc="/candidate-report.png"
            title="Report"
            desc="Get detailed report of candidates from our AI powered proctoring."
        />
      </div>
    </section>
  );
}
