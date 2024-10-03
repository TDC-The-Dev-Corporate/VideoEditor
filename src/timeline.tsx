import React from "react";

interface Timeline2Props {
  width: string; // Ensure width is a string or appropriate type
}

const Timeline2: React.FC<Timeline2Props> = ({ width }) => {
  return (
    <div className="bg-[#02263A] h-[100px] mt-10 rounded-md gap-5 flex border-[1px] border-gray-400">
      <div className="flex flex-col gap-2 items-start ml-3 pt-[5px] shrink-0">
        <img src="./images/reverse.svg" alt="reverse" width={25} id="reverse" />
        <img
          src="./images/forwardu.svg"
          alt="forward"
          id="forward"
          width={25}
        />
        <img
          src="./images/scissors.svg"
          width={25}
          alt="scissors"
          id="scissors"
        />
      </div>

      {/* Timeline container */}
      <div className="overflow-x-auto flex-1">
        <div className="h-[75px] rounded-md bg-[#1A7791] !outline-none whitespace-nowrap mt-3 min-w-[640px]  w-[95%] overflow-x-auto flex-1">
          <div
            className="h-[75px] rounded-md bg-[#1A7791] block !outline-none whitespace-nowrap border-r-[24px] border-[#98D8C2]  border-l-[24px] border-t-2 border-b-2 relative "
            style={{ width }}
          >
            <img
              src="./images/right-arrow.svg"
              alt="reverse"
              width={18}
              id="reverse"
              className="absolute top-[18px] -right-5"
            />

            <img
              src="./images/Left.svg"
              alt="reverse"
              width={18}
              id="reverse"
              className="absolute top-[18px] -left-5 "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline2;
