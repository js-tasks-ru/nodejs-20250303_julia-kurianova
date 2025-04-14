import { Controller, Get, Request } from "@nestjs/common";
import { Public } from "./auth/public.decorator";

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get()
  main(@Request() request) {
    return `
      <html>
        <head>
          <title>Profile</title>
        </head>
        <body>
          <div id="content">Loading...</div>
          <script>
            (async () => {
              const token = localStorage.getItem('token');

              if (!token) {
                document.getElementById("content").innerHTML = \`
                  <button onclick="window.location.href='/auth/google'">
                    Login via Google
                  </button>
                \`;
                return;
              }

              try {
                const response = await fetch('/auth/profile', {
                  method: 'GET',
                  headers: {
                    'Authorization': 'Bearer ' + token
                  }
                });
                if (response.ok) {
                const data = await response.json();

                  document.getElementById("content").innerHTML = \`
                  Welcome, \${data.displayName}!<br>
                  <img src="\${data.avatar}" alt="avatar" />
                  \`;
                  return;
                }

                if (response.status === 401) {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (!refreshToken) {
                      throw new Error('No refresh token available.');
                    }

                    const res = await fetch('/auth/refresh', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ refreshToken }),
                      },
                    );

                  if (!res.ok) {
                      throw new Error('Failed to refresh token. Please log in again.');
                  }

                  const { accessToken, refreshToken: newRefreshToken } = await res.json();
                  // Store new tokens
                  localStorage.setItem('token', accessToken);
                  localStorage.setItem('refreshToken', newRefreshToken);
              }}
               catch (err) {
                document.getElementById("content").innerHTML = \`
                  <button onclick="window.location.href='/auth/google'">
                    Login via Google
                  </button>
                \`;
              }
          })();
          </script>
        </body>
      </html> `;
  }
}
