export function formatDateTime(time) {
  if (time) {
    let HumanDate = time.split(".", 1).toString();
    let HumanTime = HumanDate.split("T", 2).join(" ");
    return HumanTime
  }
  else {
    return "--"
  }
}
