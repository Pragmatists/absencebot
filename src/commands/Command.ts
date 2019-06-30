import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface CommandResponseBody {
  text: string;
  response_type: string;
  mrkdwn: boolean;
}

export abstract class Command {
  handle(intent: string, userId: string): Observable<CommandResponseBody> {
    return this.handleRequest(intent, userId).pipe(
        map(text => ({text, response_type: this.responseType, mrkdwn: this.markdown}))
    );
  }

  protected get responseType(): string {
    return 'ephemeral';
  }

  protected get markdown(): boolean {
    return true;
  }

  protected abstract handleRequest(intent: string, userId: string): Observable<string>;
}
