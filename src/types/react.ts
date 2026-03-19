export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
export type BooleanSetter = StateSetter<boolean>;