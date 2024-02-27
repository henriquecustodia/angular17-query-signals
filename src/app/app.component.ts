import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
  viewChildren,
} from "@angular/core";
import { Directive } from "@angular/core";

@Directive({
  selector: "[appSetColor]",
  standalone: true,
})
export class SetColorDirective {
  renderer = inject(Renderer2);
  elementRef = inject(ElementRef);

  colorInput = input.required<string>({ alias: "appSetColor" });

  #color = signal("");

  color = computed(() => this.#color());

  constructor() {
    effect(
      () => {
        this.setColor(this.colorInput());
      },
      { allowSignalWrites: true }
    );

    effect(() => {
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        "color",
        this.#color()
      );
    });
  }

  setColor(color: string) {
    this.#color.set(color);
  }
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [SetColorDirective],
  template: `
    <div appSetColor="blue">Texto 1</div>
    <div appSetColor="green">Texto 2</div>
    <div appSetColor="purple">Texto 3</div>
    <div appSetColor="red">Texto 4</div>

    <hr>
    
    <p>Aplique preto em todas as diretivas!</p>
    <button (click)="setAllColorsToBlack()">Aplicar</button>

    <hr />

    A cor da primeira diretiva é
    <strong>{{ firstDirective().color() }}</strong> (recuperado com viewChild())

    <hr />

    Todas as cores de todas as diretivas (recuperadas com viewChildren())
    <ul>
      @for (item of directives(); track item.color(); let index = $index) {
      <li>
        A cor da {{ index + 1 }}° diretiva é <strong>{{ item.color() }}</strong>
      </li>
      }
    </ul>

    <hr />
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  firstDirective = viewChild.required(SetColorDirective);
  directives = viewChildren(SetColorDirective);

  ngOnInit(): void {
    // console.log(this.child()?.value)
  }

  setAllColorsToBlack() {
    this.directives().forEach((setColorDirective) =>
      setColorDirective.setColor("black")
    );
  }
}
