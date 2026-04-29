import { Component, OnInit, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { INSERT_USER } from '../graphql/mutations/insertUser.mutation';
import { INSERTED_USER } from '../graphql/subscriptions/created.subscription';

@Component({
  selector: 'app-create-trainer',
  imports: [],
  templateUrl: './create-trainer.component.html',
  styleUrl: './create-trainer.component.scss'
})
export class CreateTrainerComponent implements OnInit {
  name = '';
  trainer: any;
  trainers = signal<any[]>([]);


  ngOnInit() {
    // this.apollo
    //   .subscribe({ query: INSERT_USER })
    //   .subscribe(({ data }: any) => {
    //     if (data?.trainerCreated) {
    //       this.trainers.update((arr) => [...arr, data.trainerCreated]);
    //     }
    //   });
  }

  constructor(private readonly apollo: Apollo) {}

  createTrainer() {
    this.apollo
      .mutate({
        mutation: INSERT_USER,
        variables: {
          name: this.name,
        },
      })
      .subscribe({
        next: (result: any) => {
          this.trainer = result?.data?.createTrainer;
        },
        error: (err) => {
          console.error('Erro na mutation:', err);
        },
      });
  }
}
