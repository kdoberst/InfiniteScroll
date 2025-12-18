import { Form, FormGroup, Grid, GridItem, PageSection, TextInput } from '@patternfly/react-core';
import React from 'react';
import { useLoadingConfig } from './LoadingContext';

export default function ModifyLoadConfig() {
  const { delay, itemsPerPage, setDelay, setItemsPerPage } = useLoadingConfig();
  return (
    <PageSection hasBodyWrapper={false}>
      <Form isHorizontal>
      <Grid hasGutter md={6}>
      <GridItem span={6}>
        <FormGroup label="Delay (in seconds)" fieldId="horizontal-form-name">
          <TextInput
            value={delay}
            isRequired
           type="number"
            id="horizontal-form-name"
            aria-describedby="horizontal-form-name-helper"
            name="horizontal-form-name"
            onChange={(_event, value) => setDelay(Number(value))}
            min={1}
          />
        </FormGroup>
        </GridItem>
        <GridItem span={6}> 
        <FormGroup label="Items per page" fieldId="horizontal-form-name">
          <TextInput
            value={itemsPerPage}
            isRequired
            type="number"
            id="horizontal-form-name"
            aria-describedby="horizontal-form-name-helper"
            name="horizontal-form-name"
            onChange={(_event, value) => setItemsPerPage(Number(value))}
            min={1}
          />
        </FormGroup>
    
      </GridItem>
      </Grid>  </Form>
      <hr />
    </PageSection>
  );
}
