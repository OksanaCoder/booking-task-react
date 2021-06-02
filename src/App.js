import moment from "moment";

function toDate(time) {
  return moment(time, "HH:mm");
}

const data = {
  start: "10:00",
  appointments: [
    {
      start: "10:45",
      duration: 45,
    },
    {
      start: "13:50",
      duration: 20,
    },
  ],
  end: "15:00",
};

function canBook(time) {
  if (toDate(time).isBefore(toDate(data.start))) {
    return [false, 45, time];
  }
  if (toDate(time).add(45, "minute").isAfter(toDate(data.end))) {
    return [false, 45, time];
  }
  let can = [true, 45, time];

  for (let index = 0; index < data.appointments.length; index++) {
    const apt = data.appointments[index];

    const aptStart = toDate(apt.start);
    const aptEnd = toDate(apt.start).add(apt.duration, "minute");

    const bookingDate = toDate(time);
    const bookingEndDate = toDate(time).add(45, "minute");

    if (bookingDate.isSameOrAfter(aptStart) && bookingDate.isBefore(aptEnd)) {
      can = [false, apt.duration, apt.start];
      break;
    }
    if (bookingDate.isBefore(aptStart) && bookingEndDate.isAfter(aptStart)) {
      can = [false, apt.duration, apt.start];
      break;
    }
    if (
      bookingEndDate.isAfter(aptStart) &&
      bookingEndDate.isSameOrBefore(aptEnd)
    ) {
      can = [false, apt.duration, apt.start];
      break;
    }
  }

  return can;
}

export default function App() {
  const allowed = [];

  let i = toDate(data.start);
  for (; i.isBefore(toDate(data.end)); ) {
    const [can, duration, aptStart] = canBook(i.format("HH:mm"));
    if (can) {
      allowed.push(i.format("HH:mm"));
      i = toDate(aptStart).add(duration, "minute");
    } else {
      i = toDate(aptStart).add(duration, "minute");
    }
  }

  return <div className="App">{JSON.stringify(allowed)}</div>;
}
