export type ActionFeedbackType = "success" | "error";

export function buildActionRedirect(
  path: string,
  message: string,
  type: ActionFeedbackType,
) {
  const params = new URLSearchParams({
    message,
    type,
  });

  return `${path}?${params.toString()}`;
}

export function buildSuccessRedirect(path: string, message: string) {
  return buildActionRedirect(path, message, "success");
}

export function buildErrorRedirect(path: string, message: string) {
  return buildActionRedirect(path, message, "error");
}

export function getErrorMessage(error: unknown, fallback = "Une erreur est survenue") {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}