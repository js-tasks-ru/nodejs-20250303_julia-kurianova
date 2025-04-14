import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async login(user: User) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    await this.usersService.saveRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  generateAccessToken(user: User) {
    return this.jwtService.signAsync({
      sub: user.id,
      displayName: user.displayName,
      avatar: user.avatar,
    });
  }

  generateRefreshToken(user: User) {
    return this.jwtService.signAsync(
      { displayName: user.displayName, type: "refresh" },
      { expiresIn: this.configService.get("jwt.refreshTokenExpires") },
    );
  }

  async refreshTokens(refreshToken: string) {
    // Verify the refresh token
    const payload = await this.jwtService.verifyAsync(refreshToken);

    // Ensure it's a refresh token
    if (payload.type !== "refresh") {
      throw new UnauthorizedException("Invalid token type");
    }

    // Find the user
    const user = await this.usersService.findOneByName(payload.displayName);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const accessToken = await this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(user);

    await this.usersService.saveRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
