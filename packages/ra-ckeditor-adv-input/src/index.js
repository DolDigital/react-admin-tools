import React, { useState, useRef } from 'react'
import { ControlledEditor } from '@monaco-editor/react'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import CodeIcon from '@material-ui/icons/Code'
import EditIcon from '@material-ui/icons/Edit'

import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/core/styles'

import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough'

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import Indent from '@ckeditor/ckeditor5-indent/src/indent'
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock'
import List from '@ckeditor/ckeditor5-list/src/list'
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import { useInput } from 'react-admin'

const CKEditorConfiguration = {
  plugins: [Heading, Essentials, Bold, Italic, Underline, Strikethrough, Paragraph, Table, TableToolbar, Indent, IndentBlock, List, HorizontalLine, Alignment],
  toolbar: ['heading', '|', 'outdent', 'indent', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo', '|', 'alignment', 'horizontalLine', 'bold', 'italic', 'underline', 'strikethrough', 'insertTable'],
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
  }
};


const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

const AdvancedInput = props => {
  let { source, label = null } = props
  if (!label) { label = source }
  const {
    input
  } = useInput(props)
  const [value, setValue] = useState(input.value)
  const onChange = (event, value) => {
    setValue(value);
    input.onChange(value)
  }
  const [tab, setTab] = useState(0)
  const editorRef = useRef()


  const useStyles = makeStyles(theme => ({
    TextEditor: {
      padding: '0',
      ck: {
        toolbar: {
          WebkitBorderTopLeftRadius: '24px',
          MozBorderRadiusTopleft: '24px',
          borderTopLeftRadius: '24px',
        }
      }
    },
    EditorType: {
      borderTop: '1px solid #ccc',
      borderLeft: '1px solid #ccc',
      borderRight: '1px solid #ccc',
      WebkitBorderTopLeftRadius: '4px',
      MozBorderRadiusTopleft: '4px',
      borderTopLeftRadius: '4px',
      WebkitBorderTopRightRadius: '4px',
      MozBorderRadiusTopright: '4px',
      borderTopRightRadius: '4px',
    },
    EditorTypeButtonVisual: {
      borderRight: '1px solid rgba(0, 0, 0, 0.13)',
      paddingTop: '0px',
      paddingBottom: '0px',
    },
    EditorTypeButtonCode: {
      paddingTop: '0px',
      paddingBottom: '0px',
    },
  }));
  const classes = useStyles(props);

  const GlobalCss = withStyles({
    // @global is handled by jss-plugin-global.
    '@global': {
      '.MuiBox-root': {
        padding: '0'
      },
      '.Mui-selected': {
        background: 'transparent'
      },
      '.MuiTab-root': {
        minWidth: '2px',
      },
      '.MuiTabs-root': {
        minHeight: '2px'
      }
    },
  })(() => null);



  return (
    <>
      <GlobalCss />
      <Box display={'flex'} justifyContent="space-between" alignItems="flex-end" mt={3}>
        <Typography variant="subtitle1">{label}</Typography>
        <Tabs
          value={tab}
          onChange={(event, value) => setTab(value)}
          indicatorColor="primary"
          textColor="primary"
          aria-label="icon tabs example"
          className={classes.EditorType}
          width={1 / 4}
          height={'40%'}
        >
          <Tab icon={<EditIcon />} aria-label="visual" className={classes.EditorTypeButtonVisual} />
          <Tab icon={<CodeIcon />} aria-label="code" className={classes.EditorTypeButtonCode} />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0} className={classes.TextEditor} flex={1}>
        <CKEditor
          editor={ClassicEditor}
          config={CKEditorConfiguration}
          data={value}
          onInit={editor => {
            //console.log('Editor is ready to use!', editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData()
            onChange(event, data)
          }}
          onBlur={editor => {
            //console.log('Blur.', editor);
          }}
          onFocus={editor => {
            //console.log('Focus.', editor);
          }}
        />
      </TabPanel>

      <TabPanel value={tab} index={1} className={classes.TextEditor}>
        <ControlledEditor
          height="50vh"
          language="html"
          theme="vs-dark"
          value={value}
          onChange={onChange}
          editorDidMount={(_, editor) => { editorRef.current = editor; editor.getAction('editor.action.formatDocument').run() }}
        // editor.getAction('editor.action.format').run()
        />
      </TabPanel>

    </>
  )
}

export default AdvancedInput
