import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/users.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get("oauth.google.clientID"),
      clientSecret: configService.get("oauth.google.clientSecret"),
      callbackURL: configService.get("oauth.google.callbackURL"),
      scope: configService.get("oauth.google.scope"),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    let user = await this.usersService.findOneByName(profile.displayName);
    if (!user) {
      user = await this.usersService.create({
        id: profile.id,
        displayName: profile.displayName,
        avatar: profile.photos[0].value,
      });
    }
    return user;
  }
}
