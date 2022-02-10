const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 把时间戳转换成 yyyy.mm.dd 格式
 */
const formatDate = (timestamp, sep = '.') => {
  const day = new Date(timestamp);
  const year = day.getFullYear();
  const month = day.getMonth() < 9 ? `0${day.getMonth() + 1}`: day.getMonth() + 1;
  const date = day.getDate() < 10 ? `0${day.getDate()}`: day.getDate();
  return `${year}${sep}${month}${sep}${date}`;
};

module.exports = {
  formatDate,
  formatTime,
}
