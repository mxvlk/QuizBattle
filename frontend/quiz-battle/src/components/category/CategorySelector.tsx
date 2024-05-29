import { Container } from '@mantine/core';
import { Category } from './Category';

export interface CategorySelectorProps {
    firstCategory: String,
    firstCategoryId: number,
    secondCategory: String,
    secondCategoryId: number,
    thirdCategory: String,
    thirdCategoryId: number,
    uuid: String
}

export function CategorySelector(props: CategorySelectorProps) {

  return (
    <Container>

      <Category category={props.firstCategory} categoryId={props.firstCategoryId} uuid={props.uuid}></Category>
      <Category category={props.secondCategory} categoryId={props.secondCategoryId} uuid={props.uuid}></Category>
      <Category category={props.thirdCategory} categoryId={props.thirdCategoryId} uuid={props.uuid}></Category>

    </Container>
  );
}