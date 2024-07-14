import { CommandFactory } from 'nest-commander';

import { AppModule } from '~/cli/app.module';

(async () => {
  await CommandFactory.run(AppModule);
})();
