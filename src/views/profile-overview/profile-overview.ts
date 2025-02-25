import { Profile } from '../../models/profile';
import { ViewLifecycle } from '../../scripts/lifecycle-base';
import Logger from '../../scripts/logger';
import { httpService } from '../../services/http-service';

import './profile-overview.scss';

const logger = new Logger('ProfileOverview');

export class ProfileOverview extends ViewLifecycle {
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
}
