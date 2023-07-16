import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { BuilderModule } from '@builder.io/angular';
import { FormsModule } from '@angular/forms';

enum KnowledgeLevels {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1'
}

enum Languages {
  EN = 'English',
  DE = 'German',
}

enum FavoriteTopics {
  SPORTS = 'Sports',
  POLITICS = 'Politics',
  MUSIC = 'Music',
  MOVIES = 'Movies',
  TRAVEL = 'Travel',
  FOOD = 'Food',
  TECHNOLOGY = 'Technology',
  SCIENCE = 'Science',
  ART = 'Art',
}

enum ExerciseTypes {
  MATCHING = 'Matching',
  FILL_IN_THE_BLANK = 'Fill in the blank',
  TRUE_FALSE = 'True/false',
  /*
  MULTIPLE_CHOICE = 'Multiple choice',
  OPEN_QUESTION = 'Open question',
  ESSAY = 'Essay',
  FLASHCARDS = 'Flashcards',
  CROSSWORD = 'Crossword',
  WORD_SEARCH = 'Word search',
  WORD_ORDER = 'Word order'*/
}

// function which takes enum and returns array of enum values with keys, values and labels
function enumToIdValueArray(enumObject: any) {
  return Object.keys(enumObject).map(key => ({
    id: key,
    value: enumObject[key],
    selected: false
  }));
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    BuilderModule,
    NgIf,
    NgFor,
    NgClass,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  knowledgeLevels = KnowledgeLevels;
  languages = Languages;
  favoriteTopics = enumToIdValueArray(FavoriteTopics);
  exerciseTypes = enumToIdValueArray(ExerciseTypes);
  // example of how to use form builder blocks
  // https://timdeschryver.dev/blog/a-practical-guide-to-angular-template-driven-forms#form-building-blocks
  form = {
    favoriteTopics: this.favoriteTopics,
    exerciseType: this.exerciseTypes[0].id,
  }

  state = signal({
    selectedLanguage: Languages.EN,
    selectedKnowledgeLevel: KnowledgeLevels.A2,
  })

  selectKnowledgeLevel(knowledgeLevel: KnowledgeLevels) {
    this.state.update((state: any) => ({
      ...state,
      selectedKnowledgeLevel: knowledgeLevel
    }));
  }

  selectLanguage(language: Languages) {
    this.state.update((state: any) => ({
      ...state,
      selectedLanguage: language
    }));
  }

  onSubmit(): void {
    const favoriteTopics = this.form.favoriteTopics.filter((topic: any) => topic.selected)
      .map((topic: any) => topic.value);
    const exerciseType = this.form.exerciseType;
    const language = this.state().selectedLanguage;
    const knowledgeLevel = this.state().selectedKnowledgeLevel;
    console.log({
      favoriteTopics,
      exerciseType,
      language,
      knowledgeLevel
    })
  }
}
