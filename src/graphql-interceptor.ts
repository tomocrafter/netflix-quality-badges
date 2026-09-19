export function observeGraphQLResponses(onResponse: (body: unknown) => void): void {
  const nativeFetch = window.fetch;

  window.fetch = (input, init) =>
    nativeFetch(input, init).then((response) => {
      if (isGraphQL(input)) {
        response
          .clone()
          .json()
          .then(onResponse)
          .catch(() => {});
      }
      return response;
    });
}

function isGraphQL(input: RequestInfo | URL): boolean {
  const url = input instanceof Request ? input.url : String(input);
  return new URL(url, location.href).pathname.endsWith("/graphql");
}
