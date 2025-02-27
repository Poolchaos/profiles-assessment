import { Profile } from '../../models/profile';
import { ViewLifecycle } from '../../scripts/lifecycle-base';
import Logger from '../../scripts/logger';
import { httpService } from '../../services/http-service';
import { Router } from '../../scripts/router';

import './profile-overview.scss';
import { makeReactive } from '../../utils/reactive';

const logger = new Logger('ProfileOverview');

export class ProfileOverview extends ViewLifecycle {
  public user: Profile | { [key: string]: any } = {};
  protected _viewModelId: string;

  constructor() {
    super();
    this.user = this.makeObjectReactive('user', {});
  }

  protected activate(): void {
    const profileId = Router.getCurrentParams().id;
    this.loadProfile(profileId);
  }

  private async loadProfile(id: string): Promise<void> {
    try {
      const response = await httpService.get<Profile>(`profiles/${id}`);
      console.log(' ::>> response >>>>> ', response);
      Object.assign(this.user, {
        ...response,
        status: 'single',
        lookingFor: 'Men',
        country: 'Unknown',
        about:
          'I am looking for Mr. Fucker. I can be shy at first and it can take a while to warm me up. I love watching XXX movies, walking & fucking in the park. If you can handle my pussy, then message me now.',
        playsSafe: 'No',
        bodyType: 'Slim',
        piercing: 'No',
        smoking: 'Sometimes',
        height: 'I will tell you later',
        eyeColor: 'Blue',
        hairColor: 'Colores',
        drinking: 'Sometimes',
      });
    } catch (error) {
      logger.error('Failed to load profile', error);
      this.user = null;
    }
  }
}
