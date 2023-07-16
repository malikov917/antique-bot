import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { BuilderModule } from '@builder.io/angular';
import { FormsModule } from '@angular/forms';
import { AiService } from '../ai-service/ai.service';

interface Exercise {
  sentence: string;
  options: string[];
  answer: string;
  isRevealed: boolean;
}

// generate interface from:
// selectedLanguage: Languages.EN,
// selectedKnowledgeLevel: KnowledgeLevels.A2,
// exercise: exampleExercise,
// isLoading: false,
// initialLoad: true,
// testDescription: 'A1, English'
interface AppStateModel {
  selectedLanguage: Languages,
  selectedKnowledgeLevel: KnowledgeLevels,
  exercise: Exercise[],
  isLoading: boolean,
  initialLoad: boolean
  testDescription: string
}

const exampleExercise: Exercise[] = [
  {
    "sentence": "I love to _________ pizza on the weekends.",
    "options": [
      "eat",
      "ate",
      "eating"
    ],
    "answer": "eat",
    "isRevealed": false
  },
  {
    "sentence": "My favorite dessert is __________.",
    "options": [
      "cake",
      "caked",
      "cakes"
    ],
    "answer": "cake",
    "isRevealed": false
  },
  {
    "sentence": "I usually ____________ salad for lunch.",
    "options": [
      "have",
      "had",
      "having"
    ],
    "answer": "have",
    "isRevealed": false
  },
  {
    "sentence": "I don't like ___________ seafood.",
    "options": [
      "eat",
      "ate",
      "eating"
    ],
    "answer": "eating",
    "isRevealed": false
  },
  {
    "sentence": "My mom likes to ___________ homemade pasta.",
    "options": [
      "make",
      "made",
      "making"
    ],
    "answer": "make",
    "isRevealed": false
  }
]

enum KnowledgeLevels {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1'
}

enum Languages {
  EN = 'English',
  // DE = 'German',
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
  FILL_IN_THE_BLANK = 'Fill in the blank',
  /*
  TRUE_FALSE = 'True/false',
  MATCHING = 'Matching',
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
    selected: key === 'SPORTS'
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
  aiService = inject(AiService);
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

  state = signal<AppStateModel>({
    selectedLanguage: Languages.EN,
    selectedKnowledgeLevel: KnowledgeLevels.A2,
    exercise: exampleExercise,
    isLoading: false,
    initialLoad: true,
    testDescription: 'A1, English'
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
    const favoriteTopics = this.form.favoriteTopics
      .filter((topic: any) => topic.selected)
      .map((topic: any) => topic.value);
    const exerciseType = this.form.exerciseType;
    const language = this.state().selectedLanguage;
    const knowledgeLevel = this.state().selectedKnowledgeLevel;
    this.state.update((state: any) => ({
      ...state,
      isLoading: true
    }));
    this.aiService.generateTest({
      favoriteTopics,
      exerciseType,
      language,
      knowledgeLevel
    }).subscribe((result: any) => {
      result.completion.exercises.forEach((exercise: any) => {
        exercise.isRevealed = false;
      })
      this.state.update((state: any) => ({
        ...state,
        exercise: result.completion.exercises,
        testDescription: `${knowledgeLevel}, ${language}`,
        isLoading: false
      }));
    });
  }

  checkTest(): void {
    this.state.update((state: any) => {
      const exercise = state.exercise;
      exercise.forEach((exercise: any) => {
        exercise.isRevealed = true;
      })
      return {
        ...state,
        exercise
      }
    });
  }
}
