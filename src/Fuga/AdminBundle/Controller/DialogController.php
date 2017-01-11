<?php

namespace Fuga\AdminBundle\Controller;


use Fuga\CommonBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class DialogController extends Controller
{
	public function select()
	{
		$inputId   = $this->get('request')->request->get('input');
		$tableName = $this->get('request')->request->get('table');
		$fieldName = $this->get('request')->request->get('field');
		$entityId  = $this->get('request')->request->getInt('value');
		$title 	   = $this->get('request')->request->get('title');
		$table = $this->get('container')->getTable($tableName);
		$fieldName = str_replace($entityId, '', $fieldName);
		$fieldName = str_replace('search_filter_', '', $fieldName);
		$field = $table->fields[$fieldName];

		$criteria = array();
		if ($field['l_table'] == 'page_page' && isset($field['dir'])) {
			$module = $this->get('container')->getModule($table->moduleName);
			$criteria[] = 'module_id='.(isset($module['id']) ? $module['id'] : 0 );
		}
		$criteria = implode(' AND ', $criteria);
		$paginator = $this->get('paginator');
		$paginator->paginate(
			$this->get('container')->getTable($field['l_table']),
			rawurldecode($this->generateUrl('admin_dialog_pagination', array('table' => $tableName, 'field' => $fieldName, 'entity' => $entityId, 'page' => '###'))),
			$criteria,
			10,
			1,
			6);
		$items = $this->get('container')->getItems($field['l_table'], $criteria, $field['l_field'], $paginator->limit);
		$fields = explode(',', $field['l_field']);

		$params = array(
			'table' => $table,
			'field' => $field,
			'fields' => $fields,
			'title' => $title,
			'items' => $items,
			'paginator' => $paginator,
			'entityId' => $entityId,
		);

		$response = new JsonResponse();
		$response->setData(array(
			'title' => 'Выбор: '.$field['title'],
			'button' => '<a class="btn btn-success btn-popup-choice" data-input="'.$inputId.'">Выбрать</a>',
			'content' => $this->render('admin/dialog/select', $params),
		));

		return $response;
	}

	public function pagination($table, $field, $entity, $page)
	{
		$locale = $this->get('session')->get('locale');
		$tableEntity = $this->get('container')->getTable($table);
		$fieldData = $tableEntity->fields[$field];
		$criteria = '';
		if (!empty($fieldData['l_lang'])) {
			$criteria = "locale='".$locale."'";
		}
		$paginator = $this->get('paginator');
		$paginator->paginate(
			$this->get('container')->getTable($fieldData['l_table']),
			rawurldecode($this->generateUrl('admin_dialog_pagination', array('table' => $table, 'field' => $field, 'entity' => $entity, 'page' => '###'))),
			$criteria,
			10,
			$page,
			6
		);
		$items = $this->get('container')->getItems($fieldData['l_table'], $criteria, $fieldData['l_field'], $paginator->limit);
		$fields = explode(',', $fieldData['l_field']);
		$text = '<table class="table table-condensed">
<thead><tr>
<th>Название</th>
</tr></thead><tr>
<td><a rel="0" class="popup-item">Не выбрано</a></td>
</tr>';

		foreach ($items as $item) {
			$fieldTitle = '';
			foreach ($fields as $fieldName)
				if (isset($item[$fieldName]))
					$fieldTitle .= ($fieldTitle ? ' ' : '').$item[$fieldName];
			$fieldTitle .= ' ('.$item['id'].')';
			$text .= '<tr>
<td><a rel="'.$item['id'].'" class="popup-item">'.$fieldTitle.'</a></td>
</tr>';
		}
		$text .= '</table>';
		$text .= $paginator->render();

		$response = new JsonResponse();
		$response->setData( array(
			'content' => $text
		));

		return $response;
	}

	public function tree()
	{
		$inputId = $this->get('request')->request->get('input');
		$tableName = $this->get('request')->request->get('table');
		$fieldName = $this->get('request')->request->get('field');
		$entityId = $this->get('request')->request->get('value');
		$title = $this->get('request')->request->get('title');
		$locale = $this->get('session')->get('locale');
		$table = $this->get('container')->getTable($tableName);
		$fieldName = str_replace($entityId, '', $fieldName);
		$fieldName = str_replace('search_filter_', '', $fieldName);
		$field = $table->fields[$fieldName];
		$fields = explode(',', $field['l_field']);

		if (empty($field['l_lang'])) {
			$criteria = '';
		} else {
			$criteria = "locale='".$locale."'";
		}
		if ($field['l_table'] == $tableName) {
			$criteria .= ($criteria ? ' AND ' : '').' id <> '.$entityId;
		}

		$nodes = $this->get('container')->getItems($field['l_table'], $criteria, 'left_key');
		foreach ($nodes as &$node) {
			$complexname = array();
			foreach ($fields as $fieldName) {
				if (isset($node[$fieldName])) {
					$complexname[] = $node[$fieldName];
				}
			}
			$node['complexname'] = implode(' ', $complexname);

			if (!isset($node['children'])) {
				$node['children'] = array();
			}
			if ($node['parent_id'] > 0 && isset($nodes[$node['parent_id']])) {
				$nodes[$node['parent_id']]['children'][$node['id']] = $node;
			}
		}
		unset($node);

		$params = array(
			'table' => $table,
			'title' => $title,
			'nodes' => $nodes,
			'entityId' => $entityId,
		);

		$response = new JsonResponse();
		$response->setData( array(
			'title' => 'Выбор: '.$field['title'],
			'button' => '<a class="btn btn-success btn-popup-choice" data-input="'.$inputId.'">Выбрать</a>',
			'content' => $this->render('admin/dialog/tree', $params),
		));

		return $response;
	}

	function list() {
		$inputId = $this->get('request')->request->get('input_id');
		$tableName = $this->get('request')->request->get('table_name');
		$fieldName = $this->get('request')->request->get('field_name');
		$value = $this->get('request')->request->get('value');
		$values = explode(',', $value);
		$table = $this->get('container')->getTable($tableName);
		$field = $table->fields[$fieldName];
		$lang_where = !empty($field['l_lang']) ? "locale='".$this->get('session')->get('locale')."'" : '';
		if (!empty($field['query'])) {
			$lang_where .= ($lang_where ? ' AND ' : '').'('.$field['query'].')';
		}
		$field['l_sort'] = !empty($field['l_sort']) ? $field['l_sort'] : $field['l_field'];
		$items = $this->get('container')->getItems($field["l_table"], $lang_where, $field["l_sort"]);
		$fields = explode(",", $field["l_field"]);

		$params = array(
			'field' => $field,
			'table' => $table,
			'fields' => $fields,
			'items' => $items,
			'values' => $values,
		);

		$response = new JsonResponse();
		$response->setData( array(
			'title' => 'Выбор: '.$field['title'],
			'button' => '<a class="btn btn-success btn-list-choice" data-input="'.$inputId.'">Выбрать</a>',
			'content' => $this->render('admin/dialog/list', $params),
		));

		return $response;
	}

	function getPopupList($field, $values) {
		$content = '';


		return $content;
	}

	function template()
	{
		$versionId = $this->get('request')->request->get('version_id');
		$version = $this->get('container')->getItem('template_version', $versionId);
		$text = @file_get_contents(PRJ_DIR.'/app/Resources/views/backup/'.$version['file']);
		return json_encode( array(
			'title' => 'Версия шаблона',
			'button' => '<a class="btn btn-default" data-dismiss="modal" aria-hidden="true">Закрыть</a>',
			'content' => '<div><pre>'.htmlspecialchars($text).'</pre></div>'
		));
	}
} 