export type ActionFeedbackType = "success" | "error";

export type ActionState = {
  success: boolean;
  message: string;
};

export function createSuccessState(message: string): ActionState {
  return {
    success: true,
    message,
  };
}

export function createErrorState(message: string): ActionState {
  return {
    success: false,
    message,
  };
}

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

export function getErrorMessage(
  error: unknown,
  fallback = "Une erreur est survenue",
) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}