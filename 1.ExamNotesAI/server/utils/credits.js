export const INITIAL_FREE_CREDITS = 200
export const CREDIT_GRANT_VERSION = 3

export const applyCreditGrant = async (user) => {
  if (!user) return user

  if ((user.creditGrantVersion || 1) < CREDIT_GRANT_VERSION) {
    user.credits = Math.max(user.credits || 0, INITIAL_FREE_CREDITS)
    user.isCreditAvailable = user.credits > 0
    user.creditGrantVersion = CREDIT_GRANT_VERSION
    await user.save()
  }

  return user
}
