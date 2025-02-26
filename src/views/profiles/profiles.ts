import { Profile } from '../../models/profile';
import { ViewLifecycle } from '../../scripts/lifecycle-base';
import Logger from '../../scripts/logger';
import { Router } from '../../scripts/router';
import { httpService } from '../../services/http-service';

import './profiles.scss';

const logger = new Logger('Profiles');

export class Profiles extends ViewLifecycle {
  public profiles: Profile[] = [];

  constructor() {
    super();
    this.profiles = this.makeArrayReactive('profiles', [], 'profile');
  }

  protected activate(): void {
    this.loadProfiles();
  }

  private async loadProfiles(): Promise<void> {
    try {
      const response = await httpService.get<{ profiles: Profile[] }>('profiles');
      this.profiles.length = 0;
      response.profiles.forEach((profile) => this.profiles.push(profile));
      logger.debug('Profiles loaded successfully', this.profiles);
    } catch (error) {
      logger.error('Failed to load profiles', error);
      this.profiles = [];
    }
  }

  public viewProfile(id: string): void {
    Router.navigate(`profile-overview/${id}`);
  }
}
