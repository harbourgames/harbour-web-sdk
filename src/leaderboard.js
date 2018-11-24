
export default {
  getLeaderboardAsync,
};

export function getLeaderboardAsync() {
  return Promise.reject({ code: "CLIENT_UNSUPPORTED_OPERATION", });
}
